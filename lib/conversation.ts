import { db } from '@/lib/db';

export const getConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findCOnversation(memberOneId, memberTwoId)) ||
    (await findCOnversation(memberTwoId, memberOneId));

  if (conversation) return conversation;

  conversation = await createNewConversation(memberOneId, memberTwoId);

  return conversation;
};

const findCOnversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};
